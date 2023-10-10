var R = 100;
var r = 30;
var n_total = 12;
var degR = 0;
var degr = 0;
var spring_zero_length = 40;
var n_steps = 360;

//debugger;

var G = {
  f_rotate_cos_sin: function (x, y, cos, sin) {
    return [x * cos - y * sin, x * sin + y * cos];
  },

  f_rotate: function (xy, deg) {
    var a = deg * Math.PI / 180.0;
    return G.f_rotate_cos_sin(xy[0], xy[1], Math.cos(a), Math.sin(a));
  },

  f_by_length: function (gotten_length, spring_zero_length) {
    //return Math.abs(gotten_length - spring_zero_length);
    return (gotten_length - spring_zero_length) * (gotten_length - spring_zero_length);
  }, 

  f_len_2: function (xy) {
    return xy[0] *  xy[0] + xy[1] *  xy[1];
  },

  f_energy: function (axy, bxy, spring_zero_length) {
    var len2 = (axy[0] - bxy[0]) * (axy[0] - bxy[0]) + (axy[1] - bxy[1]) * (axy[1] - bxy[1]);
    var len = Math.sqrt(len2);
    return G.f_by_length(len, spring_zero_length);
  },

  f_energy_3_points: function (axy, bxy, center_xy, spring_zero_length) {
    var new_a = [axy[0] - center_xy[0], axy[1] - center_xy[1]];
    var new_b = [bxy[0] - center_xy[0], bxy[1] - center_xy[1]];
    
    return G.f_energy(axy, center_xy, spring_zero_length) + G.f_energy(bxy, center_xy, spring_zero_length);

    var len_a = Math.sqrt(G.f_len_2(new_a));
    var len_b = Math.sqrt(G.f_len_2(new_b));
    return Math.abs(len_b - len_a);
  },

  SVG: {
    el: document.getElementById("id_main_svg"),

    f_html_clear: function () {
      G.SVG.el.innerHTML = "";
    },

    f_html_add: function (html_new) {
      G.SVG.el.innerHTML += html_new;
    },
    
    f_draw_circle: function (center_xy = [0,0], r = 100, rgb_fill = "yellow", rgb_stroke = "black", width_stroke = "1") {
      var str = '<circle cx="' + center_xy[0] + '" cy="' + center_xy[1] + '" r="' + r + ' "';
      str += 'fill="' + rgb_fill + '" ' + 'stroke="' + rgb_stroke + '" stroke-width="' + width_stroke + '"';
      return str + '/>';
    },

    f_draw_line: function (a, b, rgb_stroke = "black", width_stroke = "1") {
      var str = '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"';
      str += 'stroke="' + rgb_stroke + '" stroke-width="' + width_stroke + '"';
      return str + '/>';
    },

    f_calc_energy: function (R = 100, r = 30, n_total = 5, degR = 0, degr = 0, spring_zero_length = 70) {
      var cr = [0,r];

      function f_calc_ext_01_internal(i) {
        var angle = 360.0 / n_total * i;
        var ext_0_old = G.f_rotate([R,0], angle / 2.0 + degR);
        var ext_1_old = G.f_rotate([R,0], 180 + angle / 2.0 + degR);
        var internal_pre_old = G.f_rotate([0,-r], angle + degr);
        var internal_old = [internal_pre_old[0] + cr[0], internal_pre_old[1] + cr[1]];

        return G.f_energy_3_points(ext_0_old, ext_1_old, internal_old, spring_zero_length);
      }

      var result_energy = 0.0;
      for (let i = 0; i < n_total; i+=1) result_energy += f_calc_ext_01_internal(i);

      return result_energy;
    },

    f_draw_energy: function (arr_energy) {
      var len = arr_energy.length;
      var min = Math.min(...arr_energy);
      var max = Math.max(...arr_energy);

      //console.log("Пружина без натяга", spring_zero_length, ", r", r, ", R", R, ", \nкреплений на малом колесе", n_total, ", \nmin", min, ", \nmax", max);
      //console.log(arr_energy);

      function f_line(i) {
        var x1 = 220.0 / len * i - 110;
        var x2 = 220.0 / len * (i + 1) - 110;
        var y_0_1 = (arr_energy[i] - min) / (max - min);
        var y1 = -(y_0_1 * 100 - 50);
        var y2 = y1;
        //debugger
        return G.SVG.f_draw_line([x1,y1], [x2,y2], "gray", 1);
      }

      var str_lines = "";
      for (let i = 0; i < len; i+=1) str_lines += f_line(i);
      return str_lines;
    },

    f_values_of_energy: function (R = 100, r = 30, n_total = 1, degR = 0, degr = 0, n_steps = 30, spring_zero_length = 70, ) {
      var arr = [];
      for (let i = 0; i < n_steps; i+=1) {
        arr.push(G.SVG.f_calc_energy(R, r, n_total, degR, degr + 360 / n_steps * i, spring_zero_length));
      }
      return arr;
    },

    f_draw_picture: function (R, r, n_total, degR, degr) {
      var cR = [0,0];
      var cr = [0,r];

      function f_dist_2(axy, bxy) {
        //return G.f_len_2([axy[0] - bxy[0], axy[1] - bxy[1]]); 
      }

      function f_calc_ext_01_internal(i) {
        var angle = 360.0 / n_total * i;
        var ext_0_old = G.f_rotate([R,0], angle / 2.0 + degR);
        var ext_1_old = G.f_rotate([R,0], 180 + angle / 2.0 + degR);
        var internal_pre_old = G.f_rotate([0,-r], angle + degr);
        var internal_old = [internal_pre_old[0] + cr[0], internal_pre_old[1] + cr[1]];

        var line_0 = G.SVG.f_draw_line(ext_0_old, internal_old, "red");
        var line_1 = G.SVG.f_draw_line(ext_1_old, internal_old, "blue");
        return line_0 + line_1;
      }

      var str_lines = "";
      for (let i = 0; i < n_total; i+=1) str_lines += f_calc_ext_01_internal(i);
      
      var str_circle_ext = G.SVG.f_draw_circle(cR, R);
      var str_circle_internal = G.SVG.f_draw_circle(cr, r);

      var xy_external_zero = G.f_rotate([R,0], degR);
      var xy_internal_zero = [G.f_rotate([0,-r], degr)[0] + cr[0], G.f_rotate([0,-r], degr)[1] + cr[1]];
      var mark_external = G.SVG.f_draw_circle(xy_external_zero, 4.2, "green");
      var mark_internal = G.SVG.f_draw_circle(xy_internal_zero, 4.2, "green");

      var svg = str_circle_ext + str_circle_internal + str_lines + mark_external + mark_internal;

      return svg;
    }
  }
};

G.range_int = document.getElementById("id_range_int");
G.range_ext = document.getElementById("id_range_ext");

function f_draw_degr_degR() {
  degr = +G.range_int.value;
  degR = +G.range_ext.value;
  //debugger
  G.SVG.f_html_clear();

  var arr = G.SVG.f_values_of_energy(R, r, n_total, degR, degr, n_steps, spring_zero_length);
  G.SVG.f_html_add(G.SVG.f_draw_picture(R, r, n_total, degR, degr));
  G.SVG.f_html_add(G.SVG.f_draw_energy(arr));
}

f_draw_degr_degR();
G.range_int.onchange = f_draw_degr_degR;
G.range_ext.onchange = f_draw_degr_degR;

function f_int_m() {
  G.range_int.value = Math.max(degr - 15, 0);
  f_draw_degr_degR();
}
function f_int_p() {
  G.range_int.value = Math.min(degr + 15, 720);
  f_draw_degr_degR();
}
function f_ext_m() {
  G.range_ext.value = Math.max(degR - 15, 0);
  f_draw_degr_degR();
}
function f_ext_p() {
  G.range_ext.value = Math.min(degR + 15, 720);
  f_draw_degr_degR();
}

document.getElementById("id_button_int_m").onclick = f_int_m;
document.getElementById("id_button_int_p").onclick = f_int_p;
document.getElementById("id_button_ext_m").onclick = f_ext_m;
document.getElementById("id_button_ext_p").onclick = f_ext_p;